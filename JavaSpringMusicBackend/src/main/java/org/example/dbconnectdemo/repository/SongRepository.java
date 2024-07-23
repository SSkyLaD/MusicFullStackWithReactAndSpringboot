package org.example.dbconnectdemo.repository;

import org.example.dbconnectdemo.model.Song;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    List<Song> findAllByUserOwnerId(Long userOwnerId, Pageable pageable);

    List<Song> findAllByUserOwnerIdAndNameContaining(Long userOwnerId, String name, Pageable pageable);

    List<Song> findAllByUserOwnerIdAndArtistContaining(Long userOwnerId, String artist, Pageable pageable);

    List<Song> findAllByUserOwnerIdAndFavoriteAndNameContaining(Long userOwnerId, boolean favorite, String name, Pageable pageable);

    List<Song> findAllByUserOwnerIdAndFavoriteAndArtistContaining(Long userOwnerId, boolean favorite, String artist, Pageable pageable);

    Song findByIdAndUserOwnerId(Long songId, Long userID);

    List<Song> findAllByUserOwnerIdAndFavorite(Long userOwnerId, boolean favorite,Pageable pageable);

    void deleteById(Long id);
}
