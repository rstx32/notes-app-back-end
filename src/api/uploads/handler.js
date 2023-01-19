import autoBind from "auto-bind"

class UploadsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
    autoBind(this)
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload
    this._validator.validateImageHeaders(data.hapi.headers)

    const fileLocation = await this._service.writeFile(data, data.hapi)

    return h
      .response({
        status: 'success',
        data: {
          fileLocation: fileLocation,
        },
      })
      .code(201)
  }
}

export default UploadsHandler
