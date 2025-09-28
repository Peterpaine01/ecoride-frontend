{
  step === 1 && (
    <>
      <div className="block-left">
        <AddressForm
          label="Où souhaitez-vous récupérer vos passagers ?"
          address={formData.departureAddress}
          onChange={(updatedAddress) =>
            setFormData((prev) => ({
              ...prev,
              departureAddress: {
                ...prev.departureAddress,
                ...updatedAddress,
              },
            }))
          }
          onSubmit={async () => {
            try {
              const coords = await getCoordinates(formData.departureAddress)
              setFormData((prev) => ({
                ...prev,
                departureAddress: {
                  ...prev.departureAddress,
                  coords,
                },
              }))
            } catch {
              console.error("Impossible de localiser l’adresse de départ.")
            }
          }}
        />
      </div>

      <div className="block-right">
        <MapContainer
          center={formData.departureAddress.coords || [48.8566, 2.3522]}
          zoom={13}
          style={{ minHeight: "300px", aspectRatio: 1 }}
          whenCreated={(mapInstance) => {
            console.info("Carte initialisée")
            mapRef.current = mapInstance
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {formData.departureAddress.coords && (
            <MapMarker
              position={formData.departureAddress.coords}
              label="Départ"
            />
          )}
          {formData.destinationAddress.coords && (
            <MapMarker
              position={formData.destinationAddress.coords}
              label="Arrivée"
            />
          )}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      </div>
    </>
  )
}

{
  step === 2 && (
    <>
      <div className="block-left">
        <AddressForm
          label="Où allez-vous ?"
          address={formData.destinationAddress}
          onChange={(updatedAddress) =>
            setFormData((prev) => ({
              ...prev,
              destinationAddress: {
                ...prev.destinationAddress,
                ...updatedAddress,
              },
            }))
          }
          onSubmit={async () => {
            try {
              const coords = await getCoordinates(formData.destinationAddress)
              setFormData((prev) => ({
                ...prev,
                destinationAddress: {
                  ...prev.destinationAddress,
                  coords,
                },
              }))
            } catch {
              console.error("Impossible de localiser l’adresse de destination.")
            }
          }}
        />
      </div>

      <div className="block-right">
        <MapContainer
          center={formData.departureAddress.coords || [48.8566, 2.3522]}
          zoom={13}
          style={{ minHeight: "300px", aspectRatio: 1 }}
          whenCreated={(mapInstance) => {
            console.info("Carte initialisée")
            mapRef.current = mapInstance
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {formData.departureAddress.coords && (
            <MapMarker
              position={formData.departureAddress.coords}
              label="Départ"
            />
          )}
          {formData.destinationAddress.coords && (
            <MapMarker
              position={formData.destinationAddress.coords}
              label="Arrivée"
            />
          )}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      </div>
    </>
  )
}

{
  step === 3 && (
    <>
      <div className="flex-column align-center">
        <h2 className="text-lg font-semibold">Temps de trajet estimé</h2>
        {formData.duration ? (
          <p className="emphase mt-20">
            {(() => {
              const duration = Math.round(formData.duration)
              if (duration >= 60) {
                const hours = Math.floor(duration / 60)
                const minutes = duration % 60
                return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
              } else {
                return `${duration}m`
              }
            })()}
          </p>
        ) : (
          <p className="text-red-600">Calcul en cours ou impossible.</p>
        )}
      </div>
      <div className="block-right">
        <MapContainer
          center={formData.departureAddress.coords || [48.8566, 2.3522]}
          zoom={13}
          style={{ minHeight: "300px", aspectRatio: 1 }}
          whenCreated={(mapInstance) => {
            console.info("Carte initialisée")
            mapRef.current = mapInstance
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {formData.departureAddress.coords && (
            <MapMarker
              position={formData.departureAddress.coords}
              label="Départ"
            />
          )}
          {formData.destinationAddress.coords && (
            <MapMarker
              position={formData.destinationAddress.coords}
              label="Arrivée"
            />
          )}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      </div>
    </>
  )
}

{
  ;(step === 1 || step === 2 || step === 3) && (
    <>
      <div className="block-left">
        {/* Étape 1 : Adresse de départ */}
        {step === 1 && (
          <>
            <AddressForm
              label="Où souhaitez-vous récupérer vos passagers ?"
              address={formData.departureAddress}
              errors={errors}
              onChange={(updatedAddress) =>
                setFormData((prev) => ({
                  ...prev,
                  departureAddress: {
                    ...prev.departureAddress,
                    ...updatedAddress,
                  },
                }))
              }
              onSubmit={async () => {
                try {
                  const coords = await getCoordinates(formData.departureAddress)
                  setFormData((prev) => ({
                    ...prev,
                    departureAddress: {
                      ...prev.departureAddress,
                      coords,
                    },
                  }))
                  setErrors("")
                } catch {
                  console.error("Impossible de localiser l’adresse de départ.")
                  setErrors("Impossible de localiser l’adresse de départ.")
                }
              }}
            />
          </>
        )}
        {/* Étape 2 : Adresse de destination */}
        {step === 2 && (
          <>
            <AddressForm
              label="Où allez-vous ?"
              address={formData.destinationAddress}
              errors={errors}
              onChange={(updatedAddress) =>
                setFormData((prev) => ({
                  ...prev,
                  destinationAddress: {
                    ...prev.destinationAddress,
                    ...updatedAddress,
                  },
                }))
              }
              onSubmit={async () => {
                try {
                  const coords = await getCoordinates(
                    formData.destinationAddress
                  )
                  setFormData((prev) => ({
                    ...prev,
                    destinationAddress: {
                      ...prev.destinationAddress,
                      coords,
                    },
                  }))
                  setErrors("")
                } catch {
                  console.error(
                    "Impossible de localiser l’adresse de destination."
                  )
                  setErrors("Impossible de localiser l’adresse de destination.")
                }
              }}
            />
          </>
        )}
        {/* Étape 3 : Calcul itinéraire */}
        {step === 3 && (
          <div className="flex-column align-center">
            <h2 className="text-lg font-semibold">Temps de trajet estimé</h2>
            {formData.duration ? (
              <p className="emphase mt-20">
                {(() => {
                  const duration = Math.round(formData.duration)
                  if (duration >= 60) {
                    const hours = Math.floor(duration / 60)
                    const minutes = duration % 60
                    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`
                  } else {
                    return `${duration}m`
                  }
                })()}
              </p>
            ) : (
              <p className="text-red-600">Calcul en cours ou impossible.</p>
            )}
          </div>
        )}
      </div>
      <div className="block-right">
        <MapContainer
          center={formData.departureAddress.coords || [48.8566, 2.3522]}
          zoom={13}
          style={{ minHeight: "300px", aspectRatio: 1 }}
          ref={mapRef}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {formData.departureAddress.coords && (
            <MapMarker
              position={formData.departureAddress.coords}
              label="Départ"
            />
          )}
          {formData.destinationAddress.coords && (
            <MapMarker
              position={formData.destinationAddress.coords}
              label="Arrivée"
            />
          )}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      </div>
    </>
  )
}
