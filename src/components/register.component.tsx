import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

type Props = {};

type State = {
	username: string;
	email: string;
	password: string;
	passwordConfirmation: string;
	successful: boolean;
	message: string;
};

export default class Register extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleRegister = this.handleRegister.bind(this);

		this.state = {
			username: "",
			email: "",
			password: "",
			passwordConfirmation: "",
			successful: false,
			message: "",
		};
	}

	validationSchema() {
		return Yup.object().shape({
			username: Yup.string()
				.test(
					"len",
					"El nombre de usuario debe contener de 3 a 20 caracteres.",
					(val: any) =>
						val &&
						val.toString().length >= 3 &&
						val.toString().length <= 20
				)
				.required("Este campo es obligatorio!"),
			email: Yup.string()
				.email("No es un correo valido.")
				.required("Este campo es obligatorio!"),
			password: Yup.string()
				.test(
					"len",
					"La contraseña debe contener de 6 a 40 caracteres.",
					(val: any) =>
						val &&
						val.toString().length >= 6 &&
						val.toString().length <= 40
				)
				.required("Este campo es obligatorio!"),
			passwordConfirmation: Yup.string().test(
				"passwords-match",
				"Passwords must match",
				function (value) {
					return this.parent.password === value;
				}
			),
		});
	}

	handleRegister(formValue: {
		username: string;
		email: string;
		password: string;
		passwordConfirmation: string;
	}) {
		const { username, email, password } = formValue;

		this.setState({
			message: "",
			successful: false,
		});

		AuthService.register(username, email, password).then(
			(response) => {
				this.setState({
					message: response.data.message,
					successful: true,
				});
			},
			(error) => {
				const resMessage =
					(error.response &&
						error.response.data &&
						error.response.data.message) ||
					error.message ||
					error.toString();

				this.setState({
					successful: false,
					message: resMessage,
				});
			}
		);
	}

	render() {
		const { successful, message } = this.state;

		const initialValues = {
			username: "",
			email: "",
			password: "",
			passwordConfirmation: "",
		};

		return (
			<div className="col-md-12">
				<div className="card card-container">
					<img
						src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
						alt="profile-img"
						className="profile-img-card"
					/>

					<Formik
						initialValues={initialValues}
						validationSchema={this.validationSchema}
						onSubmit={this.handleRegister}
					>
						<Form>
							{!successful && (
								<div>
									<div className="form-group">
										<label htmlFor="username">
											Nombre de usuario
										</label>
										<Field
											name="username"
											type="text"
											className="form-control"
										/>
										<ErrorMessage
											name="username"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<label htmlFor="email"> Correo </label>
										<Field
											name="email"
											type="email"
											className="form-control"
										/>
										<ErrorMessage
											name="email"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<label htmlFor="password">
											Contraseña
										</label>
										<Field
											name="password"
											type="password"
											className="form-control"
										/>
										<ErrorMessage
											name="password"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group">
										<label htmlFor="passwordConfirmation">
											Confirmación de contraseña
										</label>
										<Field
											name="passwordConfirmation"
											type="password"
											className="form-control"
										/>
										<ErrorMessage
											name="passwordConfirmation"
											component="div"
											className="alert alert-danger"
										/>
									</div>

									<div className="form-group mt-4">
										<button
											type="submit"
											className="btn btn-primary btn-block"
										>
											Crear cuenta
										</button>
									</div>
								</div>
							)}

							{message && (
								<div className="form-group">
									<div
										className={
											successful
												? "alert alert-success"
												: "alert alert-danger"
										}
										role="alert"
									>
										{message}
									</div>
								</div>
							)}
						</Form>
					</Formik>
				</div>
			</div>
		);
	}
}
