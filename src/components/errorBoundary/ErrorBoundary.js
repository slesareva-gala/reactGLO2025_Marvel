import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    static getDerivedStateFromError(error) {
        // Обновите состояние, чтобы при следующем рендеринге был показан резервный пользовательский интерфейс.
        return { error: true };
    }

    componentDidCatch(error, errorInfo) {
        // формируйте логи об ошибках здесь
    }

    render() {
        if (this.state.error) {
            if (this.props.fallback) return this.props.fallback
            else return <ErrorMessage />
        }
        return this.props.children
    }
}

export default ErrorBoundary