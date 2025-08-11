import { Alert } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { sendMessage } from "../store/utils/thunks";
import { showToast } from "../utils/tools";


const Contact = () => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: { email:'', firstname:'', lastname:'', textarea:'' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('Required'),
            firstname: Yup.string().required('Required'),
            lastname: Yup.string(),
            textarea: Yup.string().required('Required').max(500, 'Your message is too long.')
        }),
        onSubmit: (values,{resetForm}) => {
            dispatch(sendMessage(values))
            .unwrap()
            .then(response => {
                resetForm();
                showToast('SUCCESS', 'Thank you, we will contact you soon.');
            })
            .catch( error => showToast('ERROR', 'Sorry, try again later.') )
        }
    })

    return (
        <>
            <h1>Contact us</h1>
            <form className="mt-3" onSubmit={formik.handleSubmit} >
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" className="form-control" placeholder="abc@email.com" {...formik.getFieldProps('email')} />
                    {formik.errors.email && formik.touched.email ? <Alert variant="danger">{formik.errors.email}</Alert> : null}

                </div>
                <div className="form-group mt-2">
                    <label htmlFor="firstname">Firstname</label>
                    <input type="text" name="firstname" className="form-control" placeholder="Your firstname" {...formik.getFieldProps('firstname')} />
                    {formik.errors.firstname && formik.touched.firstname ? <Alert variant="danger">{formik.errors.firstname}</Alert> : null}
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="lastname">Lastname</label>
                    <input type="text" name="lastname" className="form-control" placeholder="Your lastname" {...formik.getFieldProps('lastname')} />
                    {formik.errors.lastname && formik.touched.lastname ? <Alert variant="danger">{formik.errors.lastname}</Alert> : null}
                </div>
                <div className="form-group mt-2">
                    <label htmlFor="textarea">Test area</label>
                    <textarea type="textarea" name="textarea" className="form-control" placeholder="Enter you comments here..." rows={3} {...formik.getFieldProps('textarea')} />
                    {formik.errors.textarea && formik.touched.textarea ? <Alert variant="danger">{formik.errors.textarea}</Alert> : null}
                </div>

                <button className="btn btn-primary mt-2" type="submit" >Submit</button>
            </form>
        </>
    )
}

export default Contact;