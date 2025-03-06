import '../Styles/searchBox.css';
import {useState} from 'react';
import PropTypes from 'prop-types';


function SearchBox({ onSearch }) {
	SearchBox.propTypes = {
		onSearch: PropTypes.func.isRequired
	}

	const [searchQuery, setSearchQuery] = useState('');

	
	const handleInputChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		onSearch(query);
	};



	return (
		<div className="search-box">
			<input 
				type="text" 
				placeholder="Search..." 
				value={searchQuery}
				onChange={handleInputChange}
			/>

			{/* <img src="./search.svg" alt="Search" /> */}
			<div className="img-box">
				<img src="./search.svg" alt="Search" />
			</div>
		</div>
	);
}

export default SearchBox;