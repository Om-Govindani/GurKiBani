import {useState} from "react";
import SearchBar from "../components/SearchBar.jsx"
import SearchResults from "../components/SearchResults.jsx";
function SearchView (){
    const [results , setResults] = useState([]) ;
    return (
        <div className="relative bg-neutral-900 h-screen w-full overflow-hidden pt-safe-top pb-safe-bottom">
            <div
                className="absolute inset-0 bg-[url('/ਦਰਬਾਰ_ਸਾਹਿਬ.jpg')] bg-cover bg-center blur-sm opacity-30 md:hidden "
                aria-hidden="true"
            />
            <div className="z-10 relative h-full w-full py-4 flex flex-col items-center justify-center px-4 overflow-y-auto">
                < SearchBar results = {results} setResults = {setResults} />
                < SearchResults results = {results}/>
                <h2 className="absolute bottom-4 text-center text-white/40">Made With ❤️ by Om Govindani</h2>
            </div>
        </div>
    )

}

export default SearchView;