import FooterSection from './components/FooterSection.jsx'
import HeaderSection from './components/HeaderSection.jsx'
import HeroSection from './components/HeroSection.jsx'

function HomeView() {

    return (

        <div>
            <div>
                <HeaderSection />
            </div>
            <div>
                <HeroSection />
            </div>
            <div>
                <FooterSection />
            </div>
        </div>
    )
}

export default HomeView