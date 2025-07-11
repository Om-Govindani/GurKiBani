function EmptyPage({title , content}) {
    return (
        <div className="h-[100vh] flex flex-col justify-center mx-auto max-w-3xl pb-40">
            <h1 className="text-2xl font-light text-orange-200 text-center ">{title}</h1>
            <h1 className="text-lg font-light text-violet-50 text-center pt-4">{content}</h1>
        </div>
    )
}
export default EmptyPage;