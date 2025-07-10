import {useState , useContext, useEffect} from "react"
import {useParams} from "react-router-dom"
import TopBar from "../components/TopBar";
import SundarGurka from "../../public/SundarGutka.json"

function BaniView(){
    return (
        <div className="relative h-screen w-full bg-neutral-900 flex-col px-2 py-5 overflow-y-scroll">
    
            <TopBar />


            
            
        </div>
    )

}

export default BaniView;