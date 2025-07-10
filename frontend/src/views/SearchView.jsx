import {useState} from "react";
import SearchBar from "../components/SearchBar.jsx"
import SearchResults from "../components/SearchResults.jsx";
import HamburgerMenu from "../components/HamburgerMenu.jsx";
function SearchView (){
    const [results , setResults] = useState([]) ;
    const [query, setQuery] = useState("");
    return (
        
            <div className="relative bg-transparent py-4 flex flex-col items-center justify-center px-4 overflow-y-auto h-screen w-full overflow-hidden">
                    <HamburgerMenu />
                    < SearchBar results = {results} setResults = {setResults} query = {query} setQuery = {setQuery} />
                    < SearchResults results = {results} setQuery = {setQuery}/>
                    <h2 className="absolute bottom-4 text-center text-white/80 mb-4 -z-1">Made With ❤️ by Om Govindani</h2>
            </div>
    )

}

export default SearchView;