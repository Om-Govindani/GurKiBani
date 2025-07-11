import {useNavigate} from "react-router-dom"
import {useState , useContext, useEffect} from "react"
import SGGSContext from "../contexts/SGGSContext";
import TopBar from "../components/TopBar";
import LanguageContext from "../contexts/LanguageContext";

function NitnemView(){
    const navigate = useNavigate()
    const SGGS = useContext(SGGSContext);
    const [language] = useContext(LanguageContext);
    const paths = [
        ["ਜਪੁਜੀ ਸਾਹਿਬ","जपुजी साहिब"] ,
        ["ਜਾਪੁ ਸਾਹਿਬ","जापु साहिब"], 
        ["ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ (ਸ੍ਰਾਵਗ ਸੁਧ ਸਮੂਹ)","त्व प्रसादि सवये (स्रावग सुध समूह)"],
        ["ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ (ਦੀਨਨ ਦੀ ਪ੍ਰਤੀਪਾਲ)","त्व प्रसादि सवये (दीनन की प्रतिपाल)"],
        ["ਕਬਿਯੋ ਬਾਚ ਬੇਨਤੀ (ਚੌਪਈ)","कबियो बाच बेनती (चौपई)"] ,
        ["ਅਨੰਦੁ ਸਾਹਿਬ","अनंदु साहिब"],
        ["ਅਨੰਦ ਸਾਹਿਬ (ਛੋਟਾ)","अनंद साहिब (छोटा)"],
        ["ਰਹਰਾਸਿ ਸਾਹਿਬ","रहरासि साहिब"],
        ["ਸੋਹਿਲਾ ਸਾਹਿਬ","सोहिला साहिब"],
        ["ਸੁਖਮਨੀ ਸਾਹਿਬ","सुखमनी साहिब"],
        ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        ["ਅਰਦਾਸ","अरदास"] ,
        ["ਸ਼ਬਦ ਹਜ਼ਾਰੇ","शबद हजारे"],
        ["ਤ੍ਵ ਪ੍ਰਸਾਦਿ (ਚੌਪਈ)","त्व प्रसादि (चौपई)"]
    ]

    const quickRefs = {
        "japji sahib":["ਜਪੁਜੀ ਸਾਹਿਬ","जपुजी साहिब"],
        "japjee sahib":["ਜਪੁਜੀ ਸਾਹਿਬ","जपुजी साहिब"],
        "chopai sahib":["ਕਬਿਯੋ ਬਾਚ ਬੇਨਤੀ (ਚੌਪਈ)","कबियो बाच बेनती (चौपई)"] ,
        "chaupai sahib":["ਕਬਿਯੋ ਬਾਚ ਬੇਨਤੀ (ਚੌਪਈ)","कबियो बाच बेनती (चौपई)"] ,
        "anand sahib" : ["ਅਨੰਦੁ ਸਾਹਿਬ","अनंदु साहिब"],
        "anand sahib" : ["ਅਨੰਦ ਸਾਹਿਬ (ਛੋਟਾ)","अनंद साहिब (छोटा)"],
        "tav prasad savaiye" : ["ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ (ਸ੍ਰਾਵਗ ਸੁਧ ਸਮੂਹ)","त्व प्रसादि सवये (स्रावग सुध समूह)"], 
        "jaap sahib" : ["ਜਾਪੁ ਸਾਹਿਬ","जापु साहिब"],
        "rehraas sahib" : ["ਰਹਰਾਸਿ ਸਾਹਿਬ","रहरासि साहिब"],
        "sohila sahib" : ["ਸੋਹਿਲਾ ਸਾਹਿਬ","सोहिला साहिब"],
        "sukhmani sahib" : ["ਸੁਖਮਨੀ ਸਾਹਿਬ","सुखमनी साहिब"],
        "salok mohalla 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "shlok mohalla 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "salok mehella 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "shlok mehella 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "salok mohala 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "shlok mohala 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "salok mehela 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "shlok mehela 9" : ["ਸਲੋਕ ਮਹਲਾ ੯","सलोक महला ९"],
        "ardas" : ["ਅਰਦਾਸ","अरदास"] ,
        "ardaas" : ["ਅਰਦਾਸ","अरदास"] ,
    }
    return (
        <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5">
    
            <TopBar />


            
            <div className="h-full mx-auto max-w-3xl mt-[20px] overflow-y-scroll">
                <div className="h-10"></div>
                <div className="h-full bg-transparent flex flex-col ">
                    { [...paths].map(([gurmukhi , devanagri] , idx)=>{
                        return ( 
                        <div 
                            key={idx} 
                            className="w-full p-4 cursor-pointer transition border-b-1 flex flex-col items-center justify-center border-zinc-700/40"
                            onClick={()=> navigate(`/bani/${devanagri}?from=bani`)}
                        >
                            {language!=="hindi" && <div className="font-gurmukhi text-xl md:text-2xl text-orange-50">{gurmukhi}</div>}
                            {language!=="gurmukhi" && <div className="font-hindi text-xl md:text-2xl text-orange-200">{devanagri}</div>}
                        </div>
                    )})}
                </div>
            </div>
        </div>
    )

}

export default NitnemView;