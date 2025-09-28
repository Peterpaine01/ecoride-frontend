import { Link } from "react-router-dom"
import React from "react"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"

const LegalNotices = () => {
  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <h1>Mentions légales</h1>

          <section>
            <h2>Éditeur du site</h2>
            <p>
              Nom de la société : Ecoride
              <br />
              Forme juridique : SASU
              <br />
              Capital social : <br />
              Adresse : Rue des Fauchets 45000 Orléans
              <br />
              Téléphone : 02 38 00 00 00
              <br />
              Email : janedoe@ecoride.com
              <br />
              Directeur de la publication : Jane Doe
            </p>
          </section>

          <section>
            <h2>Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              Nom de l’hébergeur : Northflank
              <br />
              Adresse : <br />
              Téléphone :
            </p>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>
            <p>
              L’ensemble du contenu présent sur le site Ecoride (textes, images,
              vidéos, logos, icônes, logiciels, etc.) est protégé par le droit
              d’auteur et la propriété intellectuelle. Toute reproduction,
              distribution ou utilisation sans autorisation préalable est
              interdite.
            </p>
          </section>

          <section>
            <h2>Cookies et données personnelles</h2>
            <p>
              Le site utilise des cookies pour assurer son bon fonctionnement et
              améliorer l’expérience utilisateur. Conformément au RGPD, vous
              pouvez gérer vos préférences via la bannière de consentement.
              <br />
              Pour plus d’informations sur vos droits et le traitement de vos
              données personnelles, veuillez consulter notre{" "}
              <Link to="/privacy-policy">Politique de confidentialité</Link>.
            </p>
          </section>

          <section>
            <h2>Responsabilité</h2>
            <p>
              Ecoride met tout en œuvre pour assurer l’exactitude et la mise à
              jour des informations publiées sur ce site. Toutefois, Ecoride ne
              peut garantir l’absence d’erreurs et décline toute responsabilité
              pour les dommages résultant de l’utilisation du site.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Pour toute question concernant les présentes mentions légales,
              vous pouvez nous contacter à :{" "}
              <a href="mailto:contact@ecoride.com">contact@ecoride.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default LegalNotices
