import ErrorMessage from "../errorMessage/ErrorMessage"

const Page404 = () => {
    return (
        <div>
            <ErrorMessage />
            <h2 style={{ 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px' }}>404 Page Not Found</h2>
        </div>
    )
}

export default Page404