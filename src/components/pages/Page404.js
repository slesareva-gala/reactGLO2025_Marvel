import { Helmet } from "react-helmet";
import ErrorMessage from "../errorMessage/ErrorMessage"

const Page404 = () => {
    return (
        <div>
            <Helmet>
                <meta
                    name="description"
                    content={`404 | Page not found`}
                />
                <title>Page not found</title>
            </Helmet>
            <ErrorMessage />
            <h2 style={{ 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px' }}>404 Page Not Found</h2>
        </div>
    )
}

export default Page404