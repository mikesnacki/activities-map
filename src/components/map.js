import React, { useState, useEffect, useRef } from 'react'
import { isEqual, omit, functions } from 'lodash'





function Map({ onMount, className }) {
    const props = { ref: useRef(), className }

    const [coords, setCoords] = useState({
        options: {
            center: {
                lat: 42.8962176,
                lng: -78.8344822
            },
            zoom: 14,
        }
    })

    const onLoad = () => {
        const map = new window.google.maps.Map(props.ref.current, coords)
        onMount && onMount(map)
    }

    function usePosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log(pos.latitude, pos.longitude)
                setCoords({
                    options: {
                        center: {
                            lat: pos.latitude,
                            lng: pos.longitude
                        },
                        zoom: 14,
                    }
                })
            }, function () {
            });
        } else {
            setCoords({
                options: {
                    center: {
                        lat: 42.8962176,
                        lng: -78.8344822
                    },
                    zoom: 14,
                }
            })
        }
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    useEffect(() => {
        if (!window.google) {
            const script = document.createElement(`script`)
            script.type = `text/javascript`
            script.src =
                `https://maps.google.com/maps/api/js?key=` +
                process.env.REACT_APP_GOOGLE_APIKEY + `&libraries=places`
            const headScript = document.getElementsByTagName(`script`)[0]
            headScript.parentNode.insertBefore(script, headScript)
            script.addEventListener(`load`, onLoad)
            return () => script.removeEventListener(`load`, onLoad)
        } else onLoad()
    })


    return (
        <div>
            <button onClick={usePosition}>Update Location</button>
            <div
                {...props}
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
