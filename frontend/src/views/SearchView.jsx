import {useState} from "react";
import SearchBar from "../components/SearchBar.jsx"
import SearchResults from "../components/SearchResults.jsx";
function SearchView (){
    const [results , setResults] = useState([]) ;
    return (
        <div className="relative bg-transparent py-4 flex flex-col items-center justify-center px-4 overflow-y-auto h-screen w-full overflow-hidden">
                < SearchBar results = {results} setResults = {setResults} />
                < SearchResults results = {results}/>
                <h2 className="absolute bottom-4 text-center text-white/60 mb-4">Made With ❤️ by Om Govindani</h2>
        </div>
    )

}

export default SearchView;