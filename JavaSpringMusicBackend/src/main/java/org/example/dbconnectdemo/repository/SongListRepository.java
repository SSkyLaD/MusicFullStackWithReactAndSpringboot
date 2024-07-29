package org.example.dbconnectdemo.repository;

import org.example.dbconnectdemo.model.SongList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SongListRepository extends JpaRepository<SongList, Long> {
    SongList findByName(String name);

    SongList findByUserOwnerIdAndId(Long UserOwnerId, Long Id);
}
