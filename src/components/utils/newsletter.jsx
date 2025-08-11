import { useRef } from 'react';
import { Form, Button  } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToNewsLetter } from '../store/utils/thunks';
import { showToast } from './tools';
import { clearNewsLetter } from '../store/reducers/users';


const NewsLetter = () => {
    const textIP = useRef();
    const dispatch = useDispatch();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const val = textIP.current.value;

        dispatch(addToNewsLetter({email:val}))
        .unwrap()
        .then(response => {
            if (response.newsletter === 'added') { showToast('SUCCESS', 'Thank you!') }
            if (response.newsletter === 'failed') { showToast('ERROR', 'Sorry, existing user cannot be added again.') }
            textIP.current.value = '';
            dispatch(clearNewsLetter())
        })
    }

    return (
        <>
            <div className="newsletter_container">
                <h1>Join our newsletter</h1>
                <div className="form">
                    <Form className="mt-4" onSubmit={handleSubmit} >
                        <Form.Group>
                            <Form.Control type='text' placeholder='xyz@email.com' name='email' ref={textIP} />
                        </Form.Group>

                        <Button type='submit' className='mt-2' variant='primary' >Add +</Button>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default NewsLetter;