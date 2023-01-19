import Joi from 'joi'

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/png',
      'image/avif',
      'image/gif',
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/webp'
    )
    .required(),
}).unknown()

export default ImageHeadersSchema
