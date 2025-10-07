"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Plus,
  X,
  FileText,
  User,
  Mail,
  Phone,
  Building,
  AlertTriangle,
  Info,
  Upload,
  Calendar,
} from "lucide-react";

// Categories and priorities configuration
const ticketCategories = [
  { value: "network", label: "Network Issues", icon: AlertCircle },
  { value: "hardware", label: "Hardware Problems", icon: AlertTriangle },
  { value: "software", label: "Software Issues", icon: FileText },
  { value: "email", label: "Email & Communication", icon: Mail },
  { value: "database", label: "Database Issues", icon: AlertCircle },
  { value: "security", label: "Security Concerns", icon: AlertTriangle },
  { value: "access", label: "Access & Permissions", icon: User },
  { value: "other", label: "Other", icon: Info },
];

const priorityLevels = [
  {
    value: "low",
    label: "Low",
    description: "Minor issues, no business impact",
    color: "bg-green-100 text-green-800",
    icon: Info,
  },
  {
    value: "medium",
    label: "Medium",
    description: "Moderate impact, some functionality affected",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  {
    value: "high",
    label: "High",
    description: "Significant impact, major functionality affected",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
];

const RaiseTicket = () => {
  const { currentUser } = useUser();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    department: "",
    tags: [],
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.priority) {
      newErrors.priority = "Please select a priority level";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (
      formData.contactPhone &&
      !/^\+?[\d\s-()]+$/.test(formData.contactPhone)
    ) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate ticket ID
      const ticketId = `TKT-${Date.now().toString().slice(-6)}`;

      console.log("Ticket submitted:", {
        ...formData,
        attachments,
        ticketId,
        userId: currentUser?.user?.id,
        submittedAt: new Date().toISOString(),
      });

      setSubmitStatus("success");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "",
          department: "",
          location: "",
          contactPhone: "",
          expectedDate: "",
          additionalNotes: "",
        });
        setAttachments([]);
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Raise a Ticket
          </h1>
          <p className="text-muted-foreground">
            Submit a new IT support request
          </p>
        </div>
      </div>

      {submitStatus === "error" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error submitting ticket</span>
            </div>
            <p className="text-red-700 mt-1 text-sm">
              There was an issue submitting your ticket. Please try again or
              contact IT support directly.
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the essential details about your issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Ticket Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Brief description of the issue"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  placeholder="e.g., Finance, HR, Operations"
                  className={errors.department ? "border-red-500" : ""}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Provide detailed information about the issue, including steps to reproduce, error messages, and when it started..."
                rows={4}
                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Minimum 10 characters ({formData.description.length}/10)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category and Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Category & Priority
            </CardTitle>
            <CardDescription>
              Help us route your ticket to the right team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Issue Category *</Label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mt-2">
                {ticketCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.value}
                      onClick={() =>
                        handleInputChange("category", category.value)
                      }
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        formData.category === category.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {category.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <Label>Priority Level *</Label>
              <div className="grid gap-3 md:grid-cols-2 mt-2">
                {priorityLevels.map((priority) => {
                  const IconComponent = priority.icon;
                  return (
                    <div
                      key={priority.value}
                      onClick={() =>
                        handleInputChange("priority", priority.value)
                      }
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.priority === priority.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {priority.label}
                            </span>
                            <Badge className={priority.color}>
                              {priority.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {priority.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.priority && (
                <p className="text-sm text-red-500 mt-1">{errors.priority}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Ready to submit your ticket?
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email with your ticket ID
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      priority: "",
                      department: "",
                      location: "",
                      contactPhone: "",
                      expectedDate: "",
                      additionalNotes: "",
                    });
                    setAttachments([]);
                    setErrors({});
                  }}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default RaiseTicket;
