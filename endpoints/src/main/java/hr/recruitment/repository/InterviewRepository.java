package hr.recruitment.repository;

import hr.recruitment.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserId(Long userId);
    List<Interview> findByPosition(String position);
    List<Interview> findByScoreGreaterThan(int score);
}
