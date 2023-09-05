import dashboardData from "../content/data.json"


export const formatFunction = () => {
    let data  = dashboardData.accounts.map((item )=>{
        return {
            user_profile : item.account.user_profile

        }
    });
    return {
        data : data,
        totalPages : 3,
        totalRecords : 6,
        recordsPerPage : 9
    }
    
}
export const dashboard_data = formatFunction()