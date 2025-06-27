import React, { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios/useAxios";
import { useSnackbar } from "@/contexts/SnackbarContexts";
import { Modal, Button, Input, Form, Upload, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import uploadImage from "@/utils/uploadImage";

function UserProfile({ title, user, setUser, token }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { fetchData, loading } = useAxios();
  const showSnackBar = useSnackbar();

  const fetchUserDetails = async () => {
    try {
      const res = await fetchData({
        url: "/user",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res) {
        setUser({
          loaded: true,
          data: res,
        });
      }
    } catch (err) {
      showSnackBar("Failed to fetch user details", "error");
    }
  };

  useEffect(() => {
    if (!user.loaded) {
      fetchUserDetails();
    }
  }, [user.loaded]);

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-white">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
        {title}
      </h1>

      {loading ? (
         <div className="flex justify-center items-center h-60" data-testid="loading-spinner">
    <Spin size="large" />
  </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto px-4">
          <img
            src={user.data?.image || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border shadow-md"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />

          <div className="text-base sm:text-lg space-y-2 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <strong>Name:</strong> <span>{user.data.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <strong>Email:</strong> <span>{user.data.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <strong>Phone:</strong> <span>{user.data.phone}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <strong>Username:</strong> <span>{user.data.username}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button
              className="w-full sm:w-auto"
              style={{ background: "#8a0000", padding: "0 20px" }}
              onClick={() => setShowEdit(true)}
              type="primary"
            >
              Edit Profile
            </Button>
            <Button
              className="w-full sm:w-auto"
              style={{
                color: "#8a0000",
                border: "1px solid #8a0000",
                padding: "0 20px",
              }}
              onClick={() => setShowChangePassword(true)}
              type="default"
            >
              Change Password
            </Button>
          </div>
        </div>
      )}

      <EditProfileModal
        open={showEdit}
        onCancel={() => setShowEdit(false)}
        user={user}
        setUser={setUser}
        fetchData={fetchData}
        showSnackBar={showSnackBar}
        token={token}
      />

      <ChangePasswordModal
        open={showChangePassword}
        onCancel={() => setShowChangePassword(false)}
        fetchData={fetchData}
        showSnackBar={showSnackBar}
        token={token}
      />
    </div>
  );
}

const EditProfileModal = ({
  open,
  onCancel,
  user,
  setUser,
  fetchData,
  showSnackBar,
  token,
}) => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState(user.data.image || null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(user.data);
      setImagePreview(user.data.image);
      setSelectedImage(null);
    }
  }, [open]);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      let imageUrl = user.data.image;

      if (selectedImage) {
        setUploading(true);
        imageUrl = await uploadImage("profile-images", selectedImage);
        setUploading(false);
      }

      const updated = {
        ...user.data,
        ...values,
        image: imageUrl,
      };

      await fetchData({
        url: "/user",
        method: "PUT",
        data: updated,
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({ loaded: true, data: updated });
      showSnackBar("Profile updated", "success");
      onCancel();
    } catch (err) {
      console.log(err);
      showSnackBar("Update failed", "error");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      title="Edit Profile"
      confirmLoading={uploading}
      okButtonProps={{
        style: { backgroundColor: "#8a0000", borderColor: "#8a0000" },
      }}
      cancelButtonProps={{
        style: { borderColor: "#8a0000", color: "#8a0000" },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>

        <Form.Item label="Profile Image">
          <div className="flex items-center gap-4">
            <img
              src={imagePreview || "/default-avatar.png"}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-full border"
            />
            <Upload
              customRequest={({ file }) => handleImageSelect(file)}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Choose Image</Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ChangePasswordModal = ({
  open,
  onCancel,
  fetchData,
  showSnackBar,
  token,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async ({ oldPassword, newPassword, repeatPassword }) => {
    if (newPassword !== repeatPassword) {
      showSnackBar("Passwords do not match", "error");
      return;
    }

    try {
      const response = await fetchData({
        url: "/user/update-password",
        method: "PUT",
        data: { oldPassword, newPassword },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      showSnackBar("Password updated", "success");
      form.resetFields();
      onCancel();
    } catch {
      showSnackBar("Incorrect password", "error");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={form.submit}
      okButtonProps={{
        style: { backgroundColor: "#8a0000", borderColor: "#8a0000" },
      }}
      cancelButtonProps={{
        style: { borderColor: "#8a0000", color: "#8a0000" },
      }}
      title="Change Password"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="repeatPassword"
          label="Repeat New Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserProfile;
