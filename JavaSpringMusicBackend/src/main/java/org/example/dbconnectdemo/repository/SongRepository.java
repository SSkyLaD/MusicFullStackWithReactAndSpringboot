package org.example.dbconnectdemo.repository;

import org.example.dbconnectdemo.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    Page<Song> findAllByUserOwnerId(Long userOwnerId, Pageable pageable);

    Page<Song> findAllByUserOwnerIdAndNameContaining(Long userOwnerId, String name, Pageable pageable);

    Page<Song> findAllByUserOwnerIdAndArtistContaining(Long userOwnerId, String artist, Pageable pageable);

    Page<Song> findAllByUserOwnerIdAndFavoriteAndNameContaining(Long userOwnerId, boolean favorite, String name, Pageable pageable);

    Page<Song> findAllByUserOwnerIdAndFavoriteAndArtistContaining(Long userOwnerId, boolean favorite, String artist, Pageable pageable);

    Song findByIdAndUserOwnerId(Long songId, Long userID);

    Page<Song> findAllByUserOwnerIdAndFavorite(Long userOwnerId, boolean favorite,Pageable pageable);

    void deleteById(Long id);
}
