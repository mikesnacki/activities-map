import React, { useState } from 'react';

/*global google*/

function Search({ location, map }) {

    const [value, setValue] = useState("")

    const handleSubmit = e => {
        e.preventDefault();

        const defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(location.lat + .01, location.lng + .01),
            new google.maps.LatLng(location.lat - .01, location.lng - .01)
        )

        const options = {
            bounds: defaultBounds,
            types: ['places']
        }

        const searchBox = new google.maps.places.SearchBox(value)

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();

            if (places.length === 0) return;
        })

    }

    return (
        <div
        >
            <form
                action="submit"
                onSubmit={handleSubmit}
            >
                <input
                    id="searchTextField"
                    placeholder="Search for location or place"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
        </div >
    );

}

export default Search;