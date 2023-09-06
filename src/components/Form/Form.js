// Imports
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styles
import "./Form.css";

const Form = () => {
	// State
	const [filename, setFilename] = useState("");
	const [specificFruit, setSpecificFruit] = useState("");
	const [data, setData] = useState([]);
	const [submitted, setSubmitted] = useState(false);

	// Toast
	const notify = () =>
		toast.success("Successful search! You can download de CSV now.");
	const errorNotify = () =>
		toast.error(
			"Error! Something went wrong, be sure to select valid family, order or genus."
		);

	// Filter state
	const [filter, setFilter] = useState("all");
	const [allSelected, setAllSelected] = useState(true);
	const [orderSelected, setOrderSelected] = useState(false);
	const [genusSelected, setGenusSelected] = useState(false);
	const [familySelected, setFamilySelected] = useState(false);

	// Helper functions
	const handleSubmit = (e) => {
		// Prevent browser default submit behavior
		e.preventDefault();

		// Reset data state to be empty in case we are submitting again
		setData([]);

		// Changhe state to start the request to the backend
		setSubmitted(true);
	};

	const handleClear = (e) => {
		// Prevent browser default submit behavior
		e.preventDefault();

		setSubmitted(false);
		setFilename("");
		setSpecificFruit("");
		setFilter("all");
		setAllSelected(true);
		setFamilySelected(false);
		setGenusSelected(false);
		setOrderSelected(false);
		setData([]);
	};

	const formatArray = (array) => {
		const formattedData = array.map((item) => ({
			Name: item.name,
			Family: item.family,
			Order: item.order,
			Genus: item.genus,
			Calories: item.nutritions.calories,
			Fat: item.nutritions.fat,
			Sugar: item.nutritions.sugar,
			Carbohydrates: item.nutritions.carbohydrates,
			Protein: item.nutritions.protein,
		}));

		return formattedData;
	};

	const formatString = (str) => {
		// Trim and lower case the input
		const trimmedString = str.trim().toLowerCase();

		// Uppercase the first letter to give right format
		const formattedString =
			trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);

		return formattedString;
	};

	const handleFilterChange = (selectedFilter) => {
		// Update the selected state based on the clicked filter
		if (selectedFilter === "all") {
			setAllSelected(true);
			setFamilySelected(false);
			setGenusSelected(false);
			setOrderSelected(false);
			setSpecificFruit("");

			setFilter("all");
		} else if (selectedFilter === "genus") {
			setGenusSelected(true);
			setAllSelected(false);
			setFamilySelected(false);
			setOrderSelected(false);
			setSpecificFruit("");

			setFilter("");
		} else if (selectedFilter === "family") {
			setFamilySelected(true);
			setAllSelected(false);
			setGenusSelected(false);
			setOrderSelected(false);
			setSpecificFruit("");

			setFilter("");
		} else if (selectedFilter === "order") {
			setOrderSelected(true);
			setAllSelected(false);
			setFamilySelected(false);
			setGenusSelected(false);
			setSpecificFruit("");

			setFilter("");
		}
	};

	// Effects
	useEffect(() => {
		const getAllFruits = async () => {
			let apiUrl;

            // If we have a filter we give it the right format
			let formattedFilter = "";
			if (filter.length > 0) {
				formattedFilter = formatString(filter);
			}

			if (familySelected) {
				apiUrl = `http://localhost:5001/generate-csv/family/${formattedFilter}/`;
			} else if (genusSelected) {
				apiUrl = `http://localhost:5001/generate-csv/genus/${formattedFilter}/`;
			} else if (orderSelected) {
				apiUrl = `http://localhost:5001/generate-csv/order/${formattedFilter}/`;
			} else {
				apiUrl = "http://localhost:5001/generate-csv";
			}

			try {
				// Await response
				const response = await axios.get(apiUrl);

				// Initialize formatted data array to an empty array
				let formattedData = [];

				// If the user specified a fruit here we filter the fruit list
				if (specificFruit.length > 0) {
					// Give string the required format
					const formattedString = formatString(specificFruit);

					// Filter the array
					const filteredArray = response.data.filter((item) => {
						return item.name === formattedString;
					});

					// Give format to expand object content inside of element
					formattedData = formatArray(filteredArray);
				} else {
					// Give format to expand object content inside of element
					formattedData = formatArray(response.data);
				}

				// Set data with the formatted data array and notify success
				setData(formattedData);
				notify();
			} catch (error) {
				errorNotify();
			}
		};

		// Check if the form has been submitted (by monitoring the "submitted" state)
		if (submitted) {
			getAllFruits(); // Call the function after the form is submitted
			setSubmitted(false); // Reset the "submitted" state
		}
	}, [submitted]);

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<h1>Generate CSV file</h1>
			</div>
			<div>
				<label>Filename:</label>
				<input
					type="text"
					value={filename}
					onChange={(e) => setFilename(e.target.value)}
				/>
			</div>
			<div>
				<label>Filter by:</label>
				<div className="filter-options">
					<div
						className={allSelected ? "selected" : ""}
						onClick={() => handleFilterChange("all")}
					>
						<span>All</span>
					</div>
					<div
						className={familySelected ? "selected" : ""}
						onClick={() => handleFilterChange("family")}
					>
						<span>Family</span>
					</div>
					<div
						className={genusSelected ? "selected" : ""}
						onClick={() => handleFilterChange("genus")}
					>
						<span>Genus</span>
					</div>
					<div
						className={orderSelected ? "selected" : ""}
						onClick={() => handleFilterChange("order")}
					>
						<span>Order</span>
					</div>
				</div>
				<div>
					{familySelected ? (
						<div>
							<label>Write family name desired (ex. Rosaceae): </label>
							<input
								type="text"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>
						</div>
					) : genusSelected ? (
						<div>
							<label>Write genus name desired (ex. Fragaria): </label>
							<input
								type="text"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>
						</div>
					) : orderSelected ? (
						<div>
							<label>Write order name desired (ex. Rosales): </label>
							<input
								type="text"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>
						</div>
					) : (
						<div>
							<div>
								<label>You selected all fruits</label>
							</div>
							<div>
								<label>Want a specific fruit? (optional)</label>
								<input
									type="text"
									value={specificFruit}
									onChange={(e) => setSpecificFruit(e.target.value)}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="btns-container">
				<button className="button submit" type="submit">
					Submit
				</button>
				<button className="button secondary" onClick={handleClear}>
					Clear
				</button>
			</div>
			<div className="download-btn-container">
				{data.length > 0 && (
					<CSVLink
						className="button download"
						data={data}
						filename={`${filename}.csv`}
					>
						Download CSV
					</CSVLink>
				)}
			</div>
			<ToastContainer />
		</form>
	);
};

export default Form;
