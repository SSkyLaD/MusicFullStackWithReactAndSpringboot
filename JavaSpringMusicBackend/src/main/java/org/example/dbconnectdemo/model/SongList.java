package org.example.dbconnectdemo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

//TODO Remake entity relationship 2023-07-23
@Entity
@Table(name = "SONGLISTS")
@Data
@NoArgsConstructor
public class SongList{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    private String name;

    private int sumOfSongs = 0;

    @CreationTimestamp
    private Date createDate;

    public SongList(String name){
        this.name = name;
    }

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(name = "songlist_song",joinColumns = @JoinColumn(name ="songlist_id"),
            inverseJoinColumns = @JoinColumn(name = "song_id"),uniqueConstraints = {@UniqueConstraint(
            columnNames = {"songlist_id", "song_id"})})
    private List<Song> songs = new ArrayList<>();

    @JsonBackReference
    @Column(name = "user_owner_id")
    private Long userOwnerId;
}
