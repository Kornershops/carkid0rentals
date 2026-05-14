import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MapView from '../MapView';

const mockLocations = [
  { id: 'L1', lat: 6.5244, lng: 3.3792, name: 'Lagos Office', type: 'office' },
  { id: 'L2', lat: 6.5355, lng: 3.3087, name: 'Ikeja Branch', type: 'branch' }
];

// Mock Google Maps API
const mockMap = {
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  panTo: jest.fn()
};

const mockMarker = {
  setMap: jest.fn(),
  addListener: jest.fn()
};

global.google = {
  maps: {
    Map: jest.fn(() => mockMap),
    Marker: jest.fn(() => mockMarker),
    LatLng: jest.fn((lat, lng) => ({ lat, lng })),
    event: {
      addListener: jest.fn()
    }
  }
} as any;

describe('MapView', () => {
  it('renders map container', () => {
    render(<MapView />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('initializes map with default center', () => {
    render(<MapView center={{ lat: 6.5244, lng: 3.3792 }} />);
    
    expect(global.google.maps.Map).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        center: expect.objectContaining({ lat: 6.5244, lng: 3.3792 })
      })
    );
  });

  it('renders markers for locations', () => {
    render(<MapView locations={mockLocations} />);
    
    expect(global.google.maps.Marker).toHaveBeenCalledTimes(2);
  });

  it('handles marker click', async () => {
    const onMarkerClick = jest.fn();
    render(<MapView locations={mockLocations} onMarkerClick={onMarkerClick} />);
    
    // Simulate marker click
    const markerClickHandler = mockMarker.addListener.mock.calls[0][1];
    markerClickHandler();

    await waitFor(() => {
      expect(onMarkerClick).toHaveBeenCalled();
    });
  });

  it('shows info window on marker click', async () => {
    render(<MapView locations={mockLocations} showInfoWindow />);
    
    await waitFor(() => {
      expect(screen.getByText(/lagos office/i)).toBeInTheDocument();
    });
  });

  it('handles map click for location selection', () => {
    const onLocationSelect = jest.fn();
    render(<MapView onLocationSelect={onLocationSelect} />);
    
    const mapContainer = screen.getByTestId('map-container');
    fireEvent.click(mapContainer);

    expect(onLocationSelect).toHaveBeenCalled();
  });

  it('updates center when prop changes', () => {
    const { rerender } = render(<MapView center={{ lat: 6.5244, lng: 3.3792 }} />);
    
    rerender(<MapView center={{ lat: 6.6, lng: 3.4 }} />);
    
    expect(mockMap.setCenter).toHaveBeenCalledWith(
      expect.objectContaining({ lat: 6.6, lng: 3.4 })
    );
  });

  it('handles zoom control', () => {
    render(<MapView zoom={12} />);
    
    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomInButton);

    expect(mockMap.setZoom).toHaveBeenCalledWith(13);
  });

  it('shows current location button', () => {
    render(<MapView showCurrentLocation />);
    expect(screen.getByRole('button', { name: /current location/i })).toBeInTheDocument();
  });

  it('handles current location click', async () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) => 
        success({ coords: { latitude: 6.5244, longitude: 3.3792 } })
      )
    };
    global.navigator.geolocation = mockGeolocation as any;

    render(<MapView showCurrentLocation />);
    
    fireEvent.click(screen.getByRole('button', { name: /current location/i }));

    await waitFor(() => {
      expect(mockMap.panTo).toHaveBeenCalled();
    });
  });

  it('displays search box', () => {
    render(<MapView showSearch />);
    expect(screen.getByPlaceholderText(/search location/i)).toBeInTheDocument();
  });

  it('handles search input', async () => {
    render(<MapView showSearch />);
    
    const searchInput = screen.getByPlaceholderText(/search location/i);
    fireEvent.change(searchInput, { target: { value: 'Lagos' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('Lagos');
    });
  });

  it('shows loading state', () => {
    render(<MapView loading />);
    expect(screen.getByTestId('map-loading')).toBeInTheDocument();
  });

  it('handles map load error', () => {
    render(<MapView error="Failed to load map" />);
    expect(screen.getByText(/failed to load map/i)).toBeInTheDocument();
  });
});
