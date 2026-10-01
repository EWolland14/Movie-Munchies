// App root component
function App() {
  const { Navbar, Hero, Capabilities } = window;

  return (
    <div className="bg-black min-h-screen text-white font-body selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
      </main>
    </div>
  );
}

window.App = App;

// Mount React App
if (typeof document !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
