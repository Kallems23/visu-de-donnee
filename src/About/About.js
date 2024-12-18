import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>Ce site a été réalisé par :</h1>
      <p>ROSANO Romain et CHERBLANC Noah</p>
      <p>Les données visualisées ont été générées à partir d'un <a href='https://www.kaggle.com/datasets/nextmillionaire/pizza-sales-dataset' target='blank'>dataset</a> extrait
      de Kaggle d'une pizzeria américaine sur l'année 2015.
      </p>
    </div>
  );
}

export default About;
