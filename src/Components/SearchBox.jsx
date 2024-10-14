import '../Styles/searchBox.css';



function SearchBox() {
	return (
		<div className="search-box">
			<input type="text" placeholder="Search..." />

			{/* <img src="./search.svg" alt="Search" /> */}
			<div className="img-box">
				<img src="./search.svg" alt="Search" />
			</div>
		</div>
	)
}

export default SearchBox