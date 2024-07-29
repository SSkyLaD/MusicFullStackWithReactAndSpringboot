package org.example.dbconnectdemo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


//TODO Remake entity relationship 2023-07-23
@Entity
@Table(
        name ="USERS",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends AppUser {
    private String userDir;

    private double availableMemory = 1024 * 1024 * 1024;

    private int sumOfSongs = 0;

    @OneToMany(cascade = CascadeType.ALL)
    @JsonManagedReference
    @JoinColumn(name = "user_owner_id", referencedColumnName = "id")
    private List<Song> userSongs = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JsonManagedReference
    @JoinColumn(name = "user_owner_id", referencedColumnName = "id")
    private List<SongList> userSongLists = new ArrayList<>();

}
