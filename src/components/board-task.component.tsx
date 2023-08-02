import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import TaskService from "../services/task.service";
import authService from "../services/auth.service";
import ITask from "../types/task.type copy";

type Props = {};

type State = {
	tasks: Array<ITask>;
	redirect: string | null;
	loading: boolean;
	message: string;
	successful: boolean;
};

export default class BoardUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

	this.handleCreate = this.handleCreate.bind(this);

    this.state = {
		tasks: [],
      	redirect: null,
	  	loading: false,
	  	message: "",
		successful: false,
    };
  }

  componentDidMount() {
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {		
      	this.setState({ redirect: "/login" });
    } else {
		this.setState({ loading: true });

		TaskService.getTasks().then(
			(response) => {
			if (response.status === 200) {
				// console.log(response.data.data);
				
				this.setState({
					tasks: response.data.data,
					loading: false
				});
			}
			},
			(error) => {
				this.setState({
					message: (error.response && error.response.data && error.response.data.message) || error.message || error.toString(),
					loading: false
				});
			}
		);
    }
  }

	validationSchema() {
		return Yup.object().shape({
			name: Yup.string().required("Este campo es obligatorio!"),
			priority: Yup.string().required("Este campo es obligatorio!"),
			description: Yup.string().required("Este campo es obligatorio!"),
		});
	}

	handleCreate(
		formValue: {
			name: string;
			priority: string;
			description: string;
			assigned_to: string;
		}
	) {
		const { name, priority, description, assigned_to } = formValue;

		this.setState({
			message: "",
			successful: false,
			loading: true,
		});

		TaskService.storeTask(name, priority, description, assigned_to).then(
			(response) => {
				if (response.status === 201) {					
					this.setState({
						message: 'Tarea creada correctamente.',
						successful: true,
						loading: false,
						tasks: [ ...this.state.tasks, response.data.data ]
					});
				}
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
					loading: false,
				});
			}
		);
		
	}

	deleteTask(id: number) {
		console.log(id);

		this.setState({
			message: "",
			successful: false,
			loading: true,
		});

		TaskService.deleteTask(id).then(
			(response) => {
				if (response.status === 200) {					
					this.setState({
						message: 'Tarea Eliminada correctamente.',
						successful: true,
						loading: false,
						tasks: this.state.tasks.filter((task) => task.id !== id),
					});
				}
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
					loading: false,
				});
			}
		);
		
	}

  render() {
	if (this.state.redirect) {			
		return <Navigate to={this.state.redirect} />;
	}

	const currentUser = authService.getCurrentUser();

	const { loading, tasks, message, successful } = this.state;	

	const initialValues = {
		name: "",
		description: "",
		priority: "",
		assigned_to: currentUser.id,
	};

    return (
		<div className="container">
			{ loading && (
				<div className="loading-overlay">
					<div className="loading-spinner"></div>
				</div>
			)}

			<header className="jumbotron">
				<h3>Tareas</h3>
			</header>

			<div className="container mt-4">
				<h2>Crear Tarea</h2>
				<Formik
					initialValues={initialValues}
					validationSchema={this.validationSchema}
					onSubmit={this.handleCreate}
				>
					<Form>
						{message && (
							<div className="form-group">
								<div
									className={
										successful ? "alert alert-success" : "alert alert-danger"
									}
									role="alert"
								>
									{message}
								</div>
							</div>
						)}

						<div className="">
							<div className="form-group">
								<label htmlFor="name">Nombre</label>
								<Field
									name="name"
									type="text"
									className="form-control"
								/>
								<ErrorMessage
									name="name"
									component="div"
									className="alert alert-danger"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="description">Descripción</label>
								<Field
									name="description"
									type="text"
									className="form-control"
								/>
								<ErrorMessage
									name="description"
									component="div"
									className="alert alert-danger"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="priority">Prioridad</label>
								<Field
									name="priority"
									type="text"
									className="form-control"
								/>
								<ErrorMessage
									name="priority"
									component="div"
									className="alert alert-danger"
								/>
							</div>

							<div className="form-group mt-4">
								<button
									type="submit"
									className="btn btn-primary btn-block"
									disabled={loading}
								>
									{loading && (
										<span className="spinner-border spinner-border-sm"></span>
									)}
									<span>Crear Tarea</span>
								</button>
							</div>
						</div>
					</Form>
				</Formik>
				{ tasks && (		
					<div className="container">
						<div className="row">
							{ tasks.map((task, index) => (
								<div key={index} className="col-lg-4 col-md-6 mb-4">
										<div className="card">
										<div className="card-body">
											<h5 className="card-title"> { task.name } </h5>
											<p className="card-text"> { task.description } </p>
											<p className="card-text"> asignado a:  { task.assigned_to?.name } </p>
											<button className="btn btn-danger" onClick={() => this.deleteTask(task.id)}>Eliminar</button>
										</div>
										</div>
								</div>
							))}
						</div>
					</div>			
				)}
			</div>
		</div>
    );
  }
}