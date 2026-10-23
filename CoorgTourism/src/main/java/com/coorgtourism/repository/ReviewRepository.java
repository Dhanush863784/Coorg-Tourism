package com.coorgtourism.repository;

import com.coorgtourism.entity.Review;
import com.coorgtourism.entity.ReviewType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByCustomerEmailOrderByCreatedAtDesc(String email);

    List<Review> findByReviewTypeAndServiceIdOrderByCreatedAtDesc(ReviewType reviewType, Long serviceId);

    Optional<Review> findByCustomerIdAndReviewTypeAndServiceId(Long customerId, ReviewType reviewType, Long serviceId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewType = :reviewType AND r.serviceId = :serviceId")
    Double calculateAverageRating(@Param("reviewType") ReviewType reviewType, @Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewType = :reviewType AND r.serviceId = :serviceId")
    Long countReviewsByService(@Param("reviewType") ReviewType reviewType, @Param("serviceId") Long serviceId);
}
