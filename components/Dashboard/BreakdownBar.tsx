export const BreakdownBar = ({ ratio }: {ratio: number}) => {
    if (isNaN(ratio)) return (
        <div className="h-3 w-full bg-white-dark"/>
    ) 
    else return (
        <div className="h-3 w-full bg-red">
            <div className="h-full bg-green" style={{width: `${ratio*100}%`}}/>
        </div>
    )
}