package com.moviebooking;

import com.moviebooking.entity.Movie;
import com.moviebooking.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if movies exist, if not, add sample data
        if (movieRepository.count() == 0) {
            loadSampleMovies();
        }
    }

    private void loadSampleMovies() {
        // Blockbuster Movies with Real Cinema Posters
        Movie movie1 = new Movie();
        movie1.setTitle("The Matrix");
        movie1.setGenre("Sci-Fi");
        movie1.setDurationMinutes(136);
        movie1.setPrice(12.99);
        movie1.setDescription("A computer hacker learns about the nature of reality and his role in the war against its controllers.");
        movie1.setRating(8.7);
        movie1.setPosterUrl("https://image.tmdb.org/t/p/original/ulf1aY9LXciRX2IpnJksCDJOWvp.jpg");
        movieRepository.save(movie1);

        Movie movie2 = new Movie();
        movie2.setTitle("Inception");
        movie2.setGenre("Sci-Fi");
        movie2.setDurationMinutes(148);
        movie2.setPrice(14.99);
        movie2.setDescription("A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.");
        movie2.setRating(8.8);
        movie2.setPosterUrl("https://image.tmdb.org/t/p/original/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg");
        movieRepository.save(movie2);

        Movie movie3 = new Movie();
        movie3.setTitle("The Dark Knight");
        movie3.setGenre("Action");
        movie3.setDurationMinutes(152);
        movie3.setPrice(13.99);
        movie3.setDescription("When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.");
        movie3.setRating(9.0);
        movie3.setPosterUrl("https://tse2.mm.bing.net/th/id/OIP.pzHzXKTcOWnvKPz1Tfyp0QHaLH?rs=1&pid=ImgDetMain&o=7&rm=3");
        movieRepository.save(movie3);

        Movie movie4 = new Movie();
        movie4.setTitle("Pulp Fiction");
        movie4.setGenre("Crime");
        movie4.setDurationMinutes(154);
        movie4.setPrice(11.99);
        movie4.setDescription("The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence.");
        movie4.setRating(8.9);
        movie4.setPosterUrl("https://tse2.mm.bing.net/th/id/OIP.IhmaVUWP5Apwt4QLEZmTywHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3");
        movieRepository.save(movie4);

        Movie movie5 = new Movie();
        movie5.setTitle("Forrest Gump");
        movie5.setGenre("Drama");
        movie5.setDurationMinutes(142);
        movie5.setPrice(10.99);
        movie5.setDescription("The presidencies of Kennedy and Johnson, the Vietnam War, and the Watergate scandal unfold from the perspective of an Alabama man.");
        movie5.setRating(8.8);
        movie5.setPosterUrl("https://media-cache.cinematerial.com/p/500x/4ovpiklv/forrest-gump-movie-poster.jpg?v=1560360911");
        movieRepository.save(movie5);

        // Additional Premium Movies with Real Posters
        Movie movie6 = new Movie();
        movie6.setTitle("Avatar: The Way of Water");
        movie6.setGenre("Sci-Fi");
        movie6.setDurationMinutes(192);
        movie6.setPrice(16.99);
        movie6.setDescription("Jake Sully lives with his newfound family formed on the extrasolar moon of Pandora.");
        movie6.setRating(7.8);
        movie6.setPosterUrl("https://tse4.mm.bing.net/th/id/OIP._rp3eKfy9c5k30t9z0YrJgHaKx?rs=1&pid=ImgDetMain&o=7&rm=3");
        movieRepository.save(movie6);

        Movie movie7 = new Movie();
        movie7.setTitle("Oppenheimer");
        movie7.setGenre("Biography");
        movie7.setDurationMinutes(180);
        movie7.setPrice(15.99);
        movie7.setDescription("The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.");
        movie7.setRating(8.4);
        movie7.setPosterUrl("https://tse4.mm.bing.net/th/id/OIP.Ew4Zjg1klAQO_NQRbG0dJAHaK9?rs=1&pid=ImgDetMain&o=7&rm=3");
        movieRepository.save(movie7);

        Movie movie8 = new Movie();
        movie8.setTitle("Barbie");
        movie8.setGenre("Comedy");
        movie8.setDurationMinutes(114);
        movie8.setPrice(13.99);
        movie8.setDescription("Barbie suffers a crisis that leads her to question her world and her existence.");
        movie8.setRating(7.0);
        movie8.setPosterUrl("https://th.bing.com/th/id/R.f656e5de3aa09f0dba4d4a6708f927e1?rik=ItNMfwGDqd5lmA&riu=http%3a%2f%2fmoviepostersaustralia.com%2fcdn%2fshop%2ffiles%2fBarbie_2023_Advance1SheetMargotRobbieRyanGoslingWMfront.webp%3fv%3d1712636654&ehk=%2fBVhPlllmAaAPHCd3l%2f7%2fCntG3rtJD01xSQFEJEmNis%3d&risl=&pid=ImgRaw&r=0");
        movieRepository.save(movie8);

        Movie movie9 = new Movie();
        movie9.setTitle("Spider-Man: No Way Home");
        movie9.setGenre("Action");
        movie9.setDurationMinutes(148);
        movie9.setPrice(14.99);
        movie9.setDescription("Spider-Man seeks help from Doctor Strange to restore his secret, leading to a multiverse adventure.");
        movie9.setRating(8.2);
        movie9.setPosterUrl("https://mir-s3-cdn-cf.behance.net/project_modules/1400/c590d5131586213.6197b316721dd.png");
        movieRepository.save(movie9);

        Movie movie10 = new Movie();
        movie10.setTitle("The Avengers");
        movie10.setGenre("Action");
        movie10.setDurationMinutes(143);
        movie10.setPrice(15.99);
        movie10.setDescription("Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien invasion.");
        movie10.setRating(8.0);
        movie10.setPosterUrl("https://tse4.mm.bing.net/th/id/OIP.zNDZbJ1vd_HW_D_3F1zaYgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3");
        movieRepository.save(movie10);

        // Latest Blockbusters
        Movie movie11 = new Movie();
        movie11.setTitle("Dune: Part Two");
        movie11.setGenre("Sci-Fi");
        movie11.setDurationMinutes(166);
        movie11.setPrice(16.99);
        movie11.setDescription("Paul Atreides unites with Chani and the Fremen to protect the desert planet Arrakis from those who seek to control it.");
        movie11.setRating(8.0);
        movie11.setPosterUrl("https://media-cache.cinematerial.com/p/500x/4ovpiklv/dune-part-two-movie-poster.jpg?v=1560360911");
        movieRepository.save(movie11);

        Movie movie12 = new Movie();
        movie12.setTitle("Top Gun: Maverick");
        movie12.setGenre("Action");
        movie12.setDurationMinutes(130);
        movie12.setPrice(14.99);
        movie12.setDescription("After thirty years, Maverick is still pushing the envelope as a top naval aviator.");
        movie12.setRating(8.1);
        movie12.setPosterUrl("https://media-cache.cinematerial.com/p/500x/4ovpiklv/top-gun-maverick-movie-poster.jpg?v=1560360911");
        movieRepository.save(movie12);

        Movie movie13 = new Movie();
        movie13.setTitle("The Flash");
        movie13.setGenre("Action");
        movie13.setDurationMinutes(144);
        movie13.setPrice(15.99);
        movie13.setDescription("When his attempt to save his family involves altering the past, he becomes a prisoner of a war between time.");
        movie13.setRating(6.8);
        movie13.setPosterUrl("https://media-cache.cinematerial.com/p/500x/4ovpiklv/the-flash-movie-poster.jpg?v=1560360911");
        movieRepository.save(movie13);

        System.out.println("Sample movies loaded successfully!");
    }
}
