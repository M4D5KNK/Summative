import './HeroSection.css'
import Image1 from './Images/spider-verse-1280a-1542009456969_160w.jpg'
import Image2 from './Images/Spider-Man-Into-The-Spider-Verse-Logo-PNG-Image.png'
import FeaturedSection from './FeaturedSection';

function HeroSection() {


    return (
        <div className="container">
            <div className="container-body">
                <div className="sign-in-body">
                    <div className="intro-text">
                        <h1>You Name It, We Got It! Stream Movies To Your Liking.</h1>
                        <h3>More than 30,000 users have enjoyed our streaming services. Try now and begin you
                            experience!</h3>
                    </div>
                    <h2>Featured Now Playing</h2>
                    <div className="featured-wrapper">
                        <FeaturedSection />
                    </div>
                </div>
                <div className="movie-image-container">
                    <div className="gradient"></div>
                    <img className="movie-image" src={Image1} alt="" />
                    <img className="movie-title" src={Image2} alt="" />
                    <div className="movie-info">
                        <h3>After being bitten by a radioactive spider, Brooklyn teen Miles Morales gets a crash course
                            in web-slinging from his alternate-dimension counterparts.</h3>
                    </div>
                    <button className="movie-button"><span className="movie-button-content">Watch Now</span></button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;