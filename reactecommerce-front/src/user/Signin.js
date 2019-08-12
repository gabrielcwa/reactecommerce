import React, { useState } from 'react'
import Layout from '../core/Layout'
import { Redirect } from 'react-router-dom'
import { signin, authenticate, isAuthenticated } from '../auth/index'

const Signin = () => {
    const [values, setValues] = useState({
        email: 'gcwa@cin.ufpe.br',
        password: 'gcwa123',
        error: '',
        loading: false,
        redirectToReferrer: false
    })

    const { email, password, error, loading, redirectToReferrer } = values
    const { user } = isAuthenticated()

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()

        setValues({ ...values, error: false, loading: true })

        signin({ email, password })
            .then(data => {
                if (data && data.error) {
                    setValues({
                        ...values,
                        error: data.error,
                        loading: false
                    })
                } else {
                    authenticate(data, () => {
                        setValues({ ...values, redirectToReferrer: true })
                    })
                }
            })
    }

    const signInForm = () => (
        <form>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email} />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password} />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )

    const showLoading = () => (
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        )
    )

    const redirectUser = () => {
        const USER_ADMIN = 1
        if (redirectToReferrer) {
            if (user && user.role === USER_ADMIN) {
                return <Redirect to="/admin/dashboard" />
            } else {
                return <Redirect to="/user/dashboard" />
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />
        }
    }

    return (
        <Layout title="Signin" description="Sigin React E-commercer App" className="container col-md-8 offset-md-2" >
            {showLoading()}
            {showError()}
            {signInForm()}
            {redirectUser()}
        </Layout >
    )
}

export default Signin