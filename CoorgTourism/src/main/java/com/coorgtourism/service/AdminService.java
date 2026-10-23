package com.coorgtourism.service;

import com.coorgtourism.dto.AdminDashboardDTO;
import com.coorgtourism.dto.UserResponseDTO;
import com.coorgtourism.dto.UserRoleUpdateDTO;
import com.coorgtourism.entity.*;
import com.coorgtourism.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final HomestayRepository homestayRepository;
    private final CabRepository cabRepository;
    private final TouristPlaceRepository touristPlaceRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;

    public AdminService(UserRepository userRepository,
                        RestaurantRepository restaurantRepository,
                        HomestayRepository homestayRepository,
                        CabRepository cabRepository,
                        TouristPlaceRepository touristPlaceRepository,
                        BookingRepository bookingRepository,
                        PaymentRepository paymentRepository,
                        ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.homestayRepository = homestayRepository;
        this.cabRepository = cabRepository;
        this.touristPlaceRepository = touristPlaceRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.reviewRepository = reviewRepository;
    }

    public AdminDashboardDTO getDashboardSummary() {
        BigDecimal commission = paymentRepository.sumCommissionAmountByStatus(PaymentStatus.SUCCESS);
        if (commission == null) {
            commission = BigDecimal.ZERO;
        }

        return AdminDashboardDTO.builder()
                .totalUsers(userRepository.count())
                .totalCustomers(userRepository.countByRole(Role.CUSTOMER))
                .totalOwners(userRepository.countByRole(Role.OWNER))
                .totalRestaurants(restaurantRepository.count())
                .totalHomestays(homestayRepository.count())
                .totalCabs(cabRepository.count())
                .totalTouristPlaces(touristPlaceRepository.count())
                .totalBookings(bookingRepository.count())
                .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
                .confirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED))
                .cancelledBookings(bookingRepository.countByStatus(BookingStatus.CANCELLED))
                .totalSuccessfulPayments(paymentRepository.countByStatus(PaymentStatus.SUCCESS))
                .totalPlatformCommission(commission)
                .totalReviews(reviewRepository.count())
                .build();
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToResponse(user);
    }

    @Transactional
    public UserResponseDTO updateUserRole(Long id, UserRoleUpdateDTO updateDTO, String currentUserEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (user.getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Cannot change your own role");
        }
        
        if (user.getRole() == Role.ADMIN && updateDTO.getRole() != Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot demote the last active admin account");
            }
        }

        user.setRole(updateDTO.getRole());
        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id, String currentUserEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (user.getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Cannot delete your own account");
        }

        if (user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot delete the last active admin account");
            }
        }

        userRepository.deleteById(id);
    }

    private UserResponseDTO mapToResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}
