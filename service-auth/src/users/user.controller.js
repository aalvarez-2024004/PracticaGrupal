import { changePassword } from './user.service.js'

export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const response = await changePassword(
      req.user.id,
      currentPassword,
      newPassword
    )

    res.json(response)

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}