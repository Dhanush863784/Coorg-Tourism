package com.coorgtourism.service;

import com.coorgtourism.dto.BookingRequestDTO;
import com.coorgtourism.dto.BookingResponseDTO;
import com.coorgtourism.entity.*;
import com.coorgtourism.exception.ResourceNotFoundException;
import com.coorgtourism.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;
    private final CabRepository cabRepository;
    private final RestaurantRepository restaurantRepository;
    private final TouristPlaceRepository touristPlaceRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          HomestayRepository homestayRepository,
                          CabRepository cabRepository,
                          RestaurantRepository restaurantRepository,
                          TouristPlaceRepository touristPlaceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.homestayRepository = homestayRepository;
        this.cabRepository = cabRepository;
        this.restaurantRepository = restaurantRepository;
        this.touristPlaceRepository = touristPlaceRepository;
    }

    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO, String customerEmail) {
        if (requestDTO.getEndDate().isBefore(requestDTO.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerEmail));

        BigDecimal totalAmount = BigDecimal.ZERO;

        if (requestDTO.getBookingType() == BookingType.HOMESTAY) {
            Homestay homestay = homestayRepository.findById(requestDTO.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));
            checkOverlap(requestDTO);
            
            long nights = ChronoUnit.DAYS.between(requestDTO.getStartDate(), requestDTO.getEndDate());
            if (nights == 0) nights = 1; // Same day counts as 1 night
            
            totalAmount = homestay.getPricePerNight()
                    .multiply(BigDecimal.valueOf(nights))
                    .multiply(BigDecimal.valueOf(requestDTO.getNumberOfGuests()));

        } else if (requestDTO.getBookingType() == BookingType.CAB) {
            Cab cab = cabRepository.findById(requestDTO.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cab not found"));
            if (!cab.getAvailable()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cab is currently unavailable");
            }
            checkOverlap(requestDTO);
            
            long days = ChronoUnit.DAYS.between(requestDTO.getStartDate(), requestDTO.getEndDate());
            if (days == 0) days = 1;
            
            totalAmount = cab.getPricePerDay().multiply(BigDecimal.valueOf(days));

        } else if (requestDTO.getBookingType() == BookingType.RESTAURANT) {
            Restaurant restaurant = restaurantRepository.findById(requestDTO.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
            totalAmount = restaurant.getPrice().multiply(BigDecimal.valueOf(requestDTO.getNumberOfGuests()));
            
        } else if (requestDTO.getBookingType() == BookingType.TOURIST_PLACE) {
            TouristPlace place = touristPlaceRepository.findById(requestDTO.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tourist Place not found"));
            totalAmount = place.getEntryFee().multiply(BigDecimal.valueOf(requestDTO.getNumberOfGuests()));
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .bookingType(requestDTO.getBookingType())
                .serviceId(requestDTO.getServiceId())
                .startDate(requestDTO.getStartDate())
                .endDate(requestDTO.getEndDate())
                .numberOfGuests(requestDTO.getNumberOfGuests())
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .build();

        return mapToResponse(bookingRepository.save(booking));
    }

    private void checkOverlap(BookingRequestDTO requestDTO) {
        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED);
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                requestDTO.getServiceId(),
                requestDTO.getBookingType(),
                requestDTO.getStartDate(),
                requestDTO.getEndDate(),
                activeStatuses
        );
        if (!overlapping.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Service is already booked for the selected dates.");
        }
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO getBookingById(Long id, String callerEmail, Role callerRole) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (callerRole != Role.ADMIN && !booking.getCustomer().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only view your own bookings");
        }
        return mapToResponse(booking);
    }

    public List<BookingResponseDTO> getMyBookings(String customerEmail) {
        return bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(newStatus);
        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponseDTO cancelBooking(Long id, String callerEmail, Role callerRole) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (callerRole != Role.ADMIN && !booking.getCustomer().getEmail().equals(callerEmail)) {
            throw new AccessDeniedException("You can only cancel your own bookings");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToResponse(bookingRepository.save(booking));
    }

    private BookingResponseDTO mapToResponse(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getName())
                .bookingType(booking.getBookingType())
                .serviceId(booking.getServiceId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .numberOfGuests(booking.getNumberOfGuests())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
