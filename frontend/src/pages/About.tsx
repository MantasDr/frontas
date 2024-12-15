import '../styles/about.css'

function About() {
  return (
    <html lang="en">
      <head>
        <title>Apie mus</title>
      </head>
      <body>
        <header>
          <h1>Apie mus</h1>
        </header>
        
        <main>
        <div className="gallery">
          <div className="gallery-item">
            <img src="Sigma.png" alt="Photo 1"></img>
            <p className="gallery-text">Martynas Šimkus</p>
            <p className="gallery-description">IFF-2/8 grupės studentas</p>
          </div>
          <div className="gallery-item">
            <img src="Sigma.png" alt="Photo 2"></img>
            <p className="gallery-text">Povilas Sakalauskas</p>
            <p className="gallery-description">IFF-2/8 grupės studentas</p>
          </div>
          <div className="gallery-item">
            <img src="Sigma.png" alt="Photo 3"></img>
            <p className="gallery-text">Mantas Liutkus</p>
            <p className="gallery-description">IFF-2/8 grupės studentas</p>
          </div>
          <div className="gallery-item">
            <img src="Sigma.png" alt="Photo 4"></img>
            <p className="gallery-text">Marius Varna</p>
            <p className="gallery-description">IFF-2/8 grupės studentas</p>
          </div>
        </div>
        </main>

      </body>
    </html>
  );
}


export default About;
