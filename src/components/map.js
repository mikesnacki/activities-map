import React, { useState, useEffect, useRef } from 'react'
import { isEqual, omit, functions } from 'lodash'

/*global google*/

function Map() {

    const googleMapRef = useRef()
    const autoCompleteRef = useRef()

    const [coords, setCoords] = useState({
        options: {
            center: {
                lat: 42.8962176,
                lng: -78.8344822
            },
            zoom: 15,
        },
        address: ""
    })
    const [address, setAddress] = useState("")

    useEffect(() => {
        if (!window.google) {
            const googleScript = document.createElement(`script`)
            googleScript.src = `https://maps.google.com/maps/api/js?key=` +
                process.env.REACT_APP_GOOGLE_APIKEY + `&libraries=places`
            window.document.body.appendChild(googleScript)
            googleScript.addEventListener(`load`, (onLoad, usePosition))
            return () => {
                googleScript.removeEventListener(`load`, (onLoad, usePosition))
            }
        } else onLoad()
    })

    const onLoad = () => {
        new window.google.maps.Map(googleMapRef.current, coords)
    }

    const onChange = e => {
        e.preventDefault()
        setAddress(e.target.value)

        new window.google.maps.places.Autocomplete(autoCompleteRef.current,
            {
                "types": ["geocode"]
            })
    }

    const handleSubmit = e => {
        e.preventDefault()
        codeAddress()
    }

    const codeAddress = () => {
        const geocoder = new google.maps.Geocoder();
        var searchaddress = document.getElementById("searchTextField").value

        geocoder.geocode({ 'address': searchaddress }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {

                const newLat = results[0].geometry.location.lat()
                const newLong = results[0].geometry.location.lng()
                setAddress(searchaddress)
                setCoords((prevState) => ({
                    ...prevState,
                    center: {
                        lat: newLat,
                        lng: newLong
                    },
                }
                ))
            }

            else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    const usePosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                setCoords((prevState) => ({
                    ...prevState,
                    center: {
                        lat: pos.latitude,
                        lng: pos.longitude
                    }
                }
                ))
            });
        } else {
            setCoords((prevState) => ({
                ...prevState,
                center: {
                    lat: 42.8962176,
                    lng: -78.8344822
                },
            }))
        }
    }

    return (
        <div
            onLoad={usePosition}
        >
            <form
                onSubmit={handleSubmit}
                action="submit">
                <input
                    name="location"
                    autoComplete="off"
                    id="searchTextField"
                    ref={autoCompleteRef}
                    value={address}
                    onChange={onChange}
                />
                <button type="submit">Search</button>
            </form>
            <button onClick={usePosition}>Update Location</button>
            <div
                id="google-map"
                ref={googleMapRef}
                style={{ height: `70vh`, margin: `1em 0`, borderRadius: `0.5em` }}
            />
        </div>
    )
}

const shouldUpdate = (prevProps, nextProps) => {
    const [prevFuncs, nextFuncs] = [functions(prevProps), functions(nextProps)]
    return (
        isEqual(omit(prevProps, prevFuncs), omit(nextProps, nextFuncs)) &&
        prevFuncs.every(fn => prevProps[fn].toString() === nextProps[fn].toString())
    )
}

export default React.memo(Map, shouldUpdate)
