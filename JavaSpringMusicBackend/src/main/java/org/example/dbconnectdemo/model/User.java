package org.example.dbconnectdemo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


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

    @Column(length = Integer.MAX_VALUE)
    private String userAvatar;

    {
        try {
            userAvatar ="data:image/png;base64," + Base64.getEncoder().encodeToString(Files.readAllBytes(Paths.get("src/main/resources/static/avatardefault_92824.png")));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Column(length = Integer.MAX_VALUE)
    private String userBackground;
    {
        try {
            userBackground ="data:image/jpeg;base64,"+ Base64.getEncoder().encodeToString(Files.readAllBytes(Paths.get("src/main/resources/static/danny-howe-bn-D2bCvpik-unsplash.jpg")));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @OneToMany(cascade = CascadeType.ALL)
    @JsonManagedReference
    @JoinColumn(name = "user_owner_id", referencedColumnName = "id")
    private List<Song> userSongs = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JsonManagedReference
    @JoinColumn(name = "user_owner_id", referencedColumnName = "id")
    private List<SongList> userSongLists = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private UserOtp userOtp;
}
