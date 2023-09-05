// Imports
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";

// Styles
import "./Form.css";

const Form = () => {
	// State
	const [filename, setFilename] = useState("");
	const [data, setData] = useState([]);
	const [submitted, setSubmitted] = useState(false);

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

		console.log(filename);
		console.log(filter);

		setSubmitted(true);
	};

	const handleClear = (e) => {
		// Prevent browser default submit behavior
		e.preventDefault();

		setSubmitted(false);
		setFilename("");
		setFilter("all");
		setAllSelected(true);
		setFamilySelected(false);
		setGenusSelected(false);
		setOrderSelected(false);
		setData([]);
	};

	const handleFilterChange = (selectedFilter) => {
		// Update the selected state based on the clicked filter
		if (selectedFilter === "all") {
			setAllSelected(true);
			setFamilySelected(false);
			setGenusSelected(false);
			setOrderSelected(false);

			setFilter("all");
		} else if (selectedFilter === "genus") {
			setGenusSelected(true);
			setAllSelected(false);
			setFamilySelected(false);
			setOrderSelected(false);

			setFilter("");
		} else if (selectedFilter === "family") {
			setFamilySelected(true);
			setAllSelected(false);
			setGenusSelected(false);
			setOrderSelected(false);

			setFilter("");
		} else if (selectedFilter === "order") {
			setOrderSelected(true);
			setAllSelected(false);
			setFamilySelected(false);
			setGenusSelected(false);

			setFilter("");
		}
	};

	// Effects
	useEffect(() => {
		const getAllFruits = async () => {
			let apiUrl;

			if (familySelected) {
				apiUrl = `http://localhost:5001/generate-csv/family/${filter}/`;
			} else if (genusSelected) {
				apiUrl = `http://localhost:5001/generate-csv/genus/${filter}/`;
			} else if (orderSelected) {
				apiUrl = `http://localhost:5001/generate-csv/order/${filter}/`;
			} else {
				apiUrl = "http://localhost:5001/generate-csv";
			}

			try {
				const response = await axios.get(apiUrl);

				// Give format to expand object content inside of element
				const formattedData = response.data.map((item) => ({
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

				setData(formattedData);
			} catch (error) {
				console.log(error);
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
							<label>You selected all fruits</label>
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
		</form>
	);
};

export default Form;
