package org.example.dbconnectdemo.repository;

import java.util.List;
import java.util.Optional;

import jdk.jfr.Registered;
import org.example.dbconnectdemo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    void deleteUserByUsername(String username);

    Page<User> findAll(Pageable pageable);

    List<User> findByUsernameContaining(String username,Pageable pageable);
}
