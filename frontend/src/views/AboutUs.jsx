import TopBar from "../components/TopBar"

function AboutUs(){
    return (
        <div className="relative min-h-screen w-full bg-neutral-900 flex-col px-2 py-5">
            <TopBar />
            <div className="h-fit mx-auto max-w-3xl mt-[20px]">
                <div className="h-10"></div>
                <h1 className="text-2xl text-orange-200 font-light text-center mt-4">वाहेगुरु जी का खालसा</h1>
                <h1 className="text-2xl text-orange-200 font-light text-center">वाहेगुरु जी की फ़तेह </h1>
            </div>
        </div>
    )
}
export default AboutUs