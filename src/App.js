// Components
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";

// Styles
import "./App.css";

const App = () => {
	return (
		<>
			<Header />
			<section className="form-container">        
				<Form />
			</section>
		</>
	);
};

export default App;
