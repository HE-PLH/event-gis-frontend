import React, { useEffect, useState } from 'react';
import './attendees.css';
import EventForm from '../../components/EventForm/EventForm';
import PageHeader from '../../components/PageHeader/PageHeader';
import * as eventAPI from '../../services/events-api';
import * as googleAPI from '../../services/google-autocomplete';

function EventAttendeesViewPage(props) {

    // set initial state
    const [event, setEvent] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // make call to back-end api to get event data
            const results = await eventAPI.getOne(props.match.params.id);
            console.log(results);

            if(props.user._id !== results.user || results.err) {
                // replace history if not owner or if error getting data
                props.history.replace('/');
            } else {
                // set state
                setEvent(results);
                setIsLoaded(true);
            }
        }
        fetchData();
    }, [ props ]);

    // update state based on input values
    const handleInputChange = (e) => setEvent({
        ...event,
        [e.currentTarget.name]: e.currentTarget.value
    });

    // handle google address autocomplete field
    const handleAutocomplete = (updatedState) => setEvent({
        ...event,
        ...updatedState
    });

    // prevent form submission when selecting address with 'enter' key
    const onKeyDown = (keyEvent) => googleAPI.keyDown(keyEvent);

    const handleImageUpload = async (e) => {
        // upload image to aws s3
        const img = await eventAPI.uploadImage(e.target.files);
        event.image = img.path;
        setEvent({...event});

        // update db with new file image path
        const updatedEvent = await eventAPI.update(event)
        setEvent(updatedEvent);

        // go to event page to see updated info
        props.history.push(`/events/${event._id}`);
    }

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // make call to back-end api / update event
        const updatedEvent = await eventAPI.update(event);
        setEvent(updatedEvent);

        // go to event page to see updated info
        props.history.push(`/events/${event._id}`);
    }

    return (
        <div className='EventViewPage'>

            <PageHeader />

            <div className='container py-3'>
                {isLoaded ? (
                    // add logic for displaying attendees
                    <>
                        <h1 className="event-name">
                            <span>{event.name}</span>
                        </h1>

                        <div className="row">
                            {/* no image */}
                            <div className="col-lg-8">
                                <p>{event.description}</p>

                                <h2>Attendees</h2>
                                {console.log(event.attendees)}
                                <ul>
                                    {event.attendees.map((attendee, idx) => (
                                        <li key={idx}>{attendee.name}</li>
                                    ))}
                                </ul>


                                </div>

                        </div>
                        </>
                ) : (
                    <>Loading...</>
                )}
            </div>

        </div>
    );
}

export default EventAttendeesViewPage;