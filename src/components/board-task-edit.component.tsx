import { Component } from "react";
import { useParams } from "react-router-dom";
import authService from "../services/auth.service";
import ITask from "../types/task.type copy";
import taskService from "../services/task.service";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";


type Props = {};

type State = {
	task: ITask;
	redirect: string | null;
	loading: boolean;
	message: string;
	successful: boolean;
};



export default class BoardTaskEdit extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        // console.log(props.id);
        
        
    
        // this.handleCreate = this.handleCreate.bind(this);
    
        this.state = {
            task: {},
            redirect: null,
            loading: false,
            message: "",
            successful: false,
        };
    }

    componentDidMount() {
        const currentUser = authService.getCurrentUser();

        const id = parseInt(window.location.href.split('/')[5], 10) // Ruta valida http://localhost:3000/task/edit/{id que necesito}        
    
        if (!currentUser) {		
              this.setState({ redirect: "/login" });
        } else {
            this.setState({ loading: true });      
    
            taskService.showTask(id).then(
                (response) => {
                if (response.status === 200) {
                    // console.log(response.data.data);
                    
                    this.setState({
                        task: response.data.data,
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

    handleUpdate(
		formValue: {
			id: string;
			name: string;
			priority: string;
			description: string;
			assigned_to: string;
		}
	) {
		const { id, name, priority, description, assigned_to } = formValue;

		this.setState({
			message: "",
			successful: false,
			loading: true,
		});

		taskService.updateTask(id, name, priority, description, assigned_to).then(
			(response) => {
				if (response.status === 201) {					
					this.setState({
						message: 'Tarea actualizada correctamente.',
						successful: true,
						loading: false,
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

        const currentUser = authService.getCurrentUser();

        const { task, loading, message, successful } = this.state;	
        console.log(task);
        
        const initialValues = {
            id: "",
            name: task.name ?? "",
            description: "",
            priority: "",
            assigned_to: task.id,
        };

        return (
        <div className="container">
            <header className="jumbotron">
                <h3>Actualizar tarea</h3>
            </header>
                Nombre:  {task.name}, <br />
                Descripción:  {task.description}, <br />
         
            <Formik
					initialValues={initialValues}
					validationSchema={this.validationSchema}
					onSubmit={this.handleUpdate}
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
									<span>Actualizar Tarea</span>
								</button>
							</div>
						</div>
					</Form>
				</Formik>
        </div>
        );
    }
}
