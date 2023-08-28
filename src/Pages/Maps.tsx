import { useRef, useState, useCallback } from 'react';
import { Autocomplete, DrawingManager, GoogleMap, Polygon, useJsApiLoader, } from '@react-google-maps/api';
import { Button } from 'react-bootstrap';


//const libraries = ['places', 'drawing'];
const MapComponent = () => {

    const mapRef = useRef<google.maps.Map>();
    const polygonRefs = useRef<google.maps.Polygon>();
    const activePolygonIndex = useRef(0);
    const autocompleteRef = useRef<React.MutableRefObject<undefined>>();
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyB4QUgfnF1jHBokJPXuxHs_sSPCZ7r_VeY',
        libraries: ['places', 'drawing']
    });

    const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);

    const defaultCenter = {
        lat: 39.216266,
        lng: 9.105973
    }
    const [center, setCenter] = useState(defaultCenter);

    const containerStyle = {
        width: '100%',
        height: '400px',
    }

    const autocompleteStyle = {
        boxSizing: 'border-box',
        border: '1px solid transparent',
        width: '240px',
        height: '38px',
        padding: '0 12px',
        borderRadius: '3px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
        fontSize: '14px',
        outline: 'none',
        textOverflow: 'ellipses',
        position: 'absolute',
        right: '8%',
        top: '11px',
        marginLeft: '-120px',
    }



    const polygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: true,
        editable: true
    }

    const drawingManagerOptions = {
        polygonOptions: polygonOptions,
        drawingControl: true,
        drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_CENTER,
            drawingModes: [
                window.google?.maps?.drawing?.OverlayType?.POLYGON
            ]
        }
    }

    const onLoadMap = (map:google.maps.Map) => {
        mapRef.current = map;
    }

    const onLoadPolygon = (polygon:google.maps.Polygon, index:number) => {
        polygonRefs.current = polygon;
    }

    const onClickPolygon = (index:number) => {
        activePolygonIndex.current = index;
    }

    const onLoadAutocomplete = (autocomplete:React.MutableRefObject<undefined>) => {
        autocompleteRef.current = autocomplete;
    }

    // sarebbe corretto modificare la classe eliminando undefined?
    const onPlaceChanged = () => {
        const { geometry } = autocompleteRef.current!.getPlace();//possible undefined 
        const bounds = new window.google.maps.LatLngBounds();
        if (geometry.viewport) {
            bounds.union(geometry.viewport);
        } else {
            bounds.extend(geometry.location);
        }
        mapRef.current!.fitBounds(bounds); //possible undefinded
    }

    const onLoadDrawingManager = (drawingManager: google.maps.drawing.DrawingManager) => {
        drawingManagerRef.current = drawingManager;
    }

    const onOverlayComplete = ($overlayEvent:google.maps.drawing.OverlayCompleteEvent) => {
        drawingManagerRef.current!.setDrawingMode(null); //possible undefinded
        if ($overlayEvent.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const newPolygon = $overlayEvent.overlay.getPath() 
                .getArray()
                .map((latLng: { lat: () => number; lng: () => number; }) => ({ lat: latLng.lat(), lng: latLng.lng() }))

            // start and end point should be same for valid geojson
            const startPoint = newPolygon[0];
            newPolygon.push(startPoint);
            $overlayEvent.overlay?.setMap(null);
            setPolygons([...polygons, newPolygon]);
        }
    }

    const onDeleteDrawing = () => {
        const filtered = polygons.filter((polygon, index) => index !== activePolygonIndex.current) 
        setPolygons(filtered)
    }

    const onEditPolygon = (index:number) => {
        // const polygonRef = polygonRefs.current;
        // if (polygonRef) {
        //     const coordinates = polygonRef.getPath()
        //         .getArray()
        //         .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));


        //     const allPolygons = [...polygons];
        //     allPolygons[index].coordinate = coordinates;
        //     setPolygons(allPolygons)
        // }
    }

    // Poligono fisso
    const [path, setPath] = useState([
        { lat: 39.219266, lng: 9.105973 },
        { lat: 39.216156, lng: 9.103363 },
        { lat: 39.212146, lng: 9.109053 }
    ]);

    // Define refs for Polygon instance and listeners
    const polygonRef = useRef<google.maps.Polygon>(null);
    const listenersRef = useRef<any[]>([]); // da correggere any

    // Poligono fisso
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map((latLng: { lat: () => number; lng: () => number; }) => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPath(nextPath);
            // console.log("Path: "+ path)
            // const pol = new google.maps.Polygon({paths: path});
            // console.log(google.maps.geometry.poly.containsLocation( coordinate, pol))
        }

    }, [setPath]);

    // Poligono fisso
    const onLoad2 = useCallback(
        (        polygon: { getPath: () => any; }) => {
            //polygonRef.current = polygon;
            const path = polygon.getPath(); 
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit]
    );

    // Poligono fisso
    const onUnmount2 = useCallback(() => {
        listenersRef.current.forEach((lis) => lis.remove());
        //polygonRef.current = null;
    }, []);

  
    return (
        isLoaded
            ?
            <div className='map-container' style={{ position: 'relative' }}>
                {
                    drawingManagerRef.current
                    &&
                    <div
                        onClick={onDeleteDrawing}
                        title='Delete shape'
                    >
                    </div>
                }

                <GoogleMap

                    zoom={15}
                    center={center}
                    onLoad={onLoadMap}
                    mapContainerStyle={containerStyle}
                >
                    <div style={{
                        position: "relative",
                        width: "45%",
                    }}>
                          <Button className="m-2 btn-dark" onClick={() => {
                                setPolygons([])
                            }
                            }
                            >Delete red polygon</Button>

                            <Button className="m-2 btn-dark" onClick={() => {
                                setPath([{ lat: 0, lng: 0 },
                                { lat: 0, lng: 0 },
                                { lat: 0, lng: 0 }])
                            }
                            }
                            >Delete black polygon</Button>

                            <Button className="m-2 btn-warning" onClick={() => {
                                setPath([{ lat: 39.219266, lng: 9.105973 },
                                { lat: 39.216156, lng: 9.103363 },
                                { lat: 39.212146, lng: 9.109053 }])
                            }
                            }
                            >Create black polygon</Button>
                    </div>
                    {

                    }

                    <Polygon
                        // Make the Polygon editable / draggable
                        //editable
                        draggable
                        path={path}
                        // Event used when manipulating and adding points
                        onMouseUp={onEdit}
                        // Event used when dragging the whole Polygon
                        onDragEnd={onEdit}
                        onLoad={onLoad2}
                        onUnmount={onUnmount2}
                    />
                    <DrawingManager
                        onLoad={onLoadDrawingManager}
                        onOverlayComplete={onOverlayComplete}
                        options={drawingManagerOptions}
                    />

                    {
                        polygons.map((iterator, index) => (
                            <Polygon
                                key={index}
                                onLoad={(event) => onLoadPolygon(event, index)}
                                onMouseDown={() => onClickPolygon(index)}
                                onMouseUp={() => onEditPolygon(index)}
                                onDragEnd={() => onEditPolygon(index)}
                                options={polygonOptions}
                                paths={iterator}
                                draggable
                                editable
                            />
                        ))
                    }
                    <Autocomplete
                        onLoad={onLoadAutocomplete}
                        onPlaceChanged={onPlaceChanged}
                    >
                        <input
                            type='text'
                            placeholder='Search Location'

                        />
                    </Autocomplete>
                </GoogleMap>
            </div >
            :
            null

    );

}

export default MapComponent;


