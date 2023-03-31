function App() {
  return (
    <div className="App noise">
      <div className="mx-28 flex h-screen items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1>
            hey, i'm <span className="text-primary">emre</span>
            <br />i build <span className="text-primary">things.</span>
          </h1>
          <p className="mt-4">
            Graphic designah, UI/UX designah & front-end web developah
          </p>
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-3/4 rounded-full bg-primary p-5">
            <img
              className="hero-image min-h-full min-w-full flex-shrink-0 rounded-full"
              // className="hero-image max-h-md max-w-md flex-shrink-0"
              src="./selfie1.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
